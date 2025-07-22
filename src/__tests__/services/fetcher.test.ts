import { fetcher } from '../../services/fetcher';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const originalWarn = console.warn;
const mockConsoleWarn = jest.fn();
console.warn = mockConsoleWarn;

const originalEnv = process.env;

describe('fetcher', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockConsoleWarn.mockClear();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    console.warn = originalWarn;
    process.env = originalEnv;
  });

  it('выполняет успешный запрос', async () => {
    const mockData = { login: 'test-user' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetcher('https://api.github.com/user');

    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/user',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Repository-Search'
        })
      })
    );
  });

  it('добавляет токен авторизации если есть', async () => {
    process.env.REACT_APP_GITHUB_TOKEN = 'test-token';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    await fetcher('https://api.github.com/user');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });

  it('показывает предупреждение в development если токена нет', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.REACT_APP_GITHUB_TOKEN;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    await fetcher('https://api.github.com/user');

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'GITHUB_TOKEN не задан. Rate limit будет ограничен до 60 запросов/час'
    );
  });

  it('обрабатывает ошибку rate limit (403)', async () => {
    const mockHeadersGet = jest.fn((header: string): string | null => {
      const headers: Record<string, string> = {
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Reset': '1640995200'
      };

      return headers[header] || null;
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: {
        get: mockHeadersGet
      }
    });

    await expect(fetcher('https://api.github.com/user')).rejects.toMatchObject({
      message: 'Превышен rate limit',
      status: 403,
      info: {
        message: 'Превышен rate limit',
        rateLimitHeaders: {
          limit: '60',
          remaining: '0',
          reset: '1640995200'
        }
      }
    });
  });

  it('обрабатывает HTTP ошибки с JSON ответом', async () => {
    const errorData = {
      message: 'Not Found',
      documentation_url: 'https://docs.github.com/rest'
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve(errorData)
    });

    await expect(
      fetcher('https://api.github.com/repos/invalid/repo')
    ).rejects.toMatchObject({
      message: 'Ошибка запроса: 404',
      status: 404,
      info: {
        message: 'Not Found',
        parseError: 'Ошибка запроса: 404'
      }
    });
  });

  it('обрабатывает HTTP ошибки без валидного JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(
      fetcher('https://api.github.com/repos/test/repo')
    ).rejects.toMatchObject({
      status: 500,
      info: {
        message: 'Internal Server Error',
        parseError: 'Invalid JSON'
      }
    });
  });

  it('обрабатывает пустой ответ с ошибкой', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 204,
      statusText: 'No Content',
      json: () => Promise.resolve(null)
    });

    await expect(fetcher('https://api.github.com/user')).rejects.toMatchObject({
      status: 204
    });
  });

  it('обрабатывает сетевые ошибки', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetcher('https://api.github.com/user')).rejects.toThrow(
      networkError
    );
  });

  it('правильно парсит сложный JSON ответ', async () => {
    const mockData = {
      id: 1,
      nested: { prop: 'value' },
      array: [1, 2, 3]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetcher('https://api.github.com/repos/test/repo');
    expect(result).toEqual(mockData);
  });

  it('обрабатывает пустой успешный ответ', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null)
    });

    const result = await fetcher('https://api.github.com/user');
    expect(result).toBeNull();
  });

  it('не добавляет токен авторизации если он не задан', async () => {
    delete process.env.REACT_APP_GITHUB_TOKEN;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    await fetcher('https://api.github.com/user');

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('обрабатывает rate limit с Map headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: new Map([
        ['X-RateLimit-Remaining', '0'],
        ['X-RateLimit-Limit', '60'],
        ['X-RateLimit-Reset', '1640995200']
      ])
    });

    await expect(fetcher('https://api.github.com/user')).rejects.toMatchObject({
      status: 403,
      message: 'Превышен rate limit'
    });
  });

  it('вызывает fetch с правильными заголовками по умолчанию', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    await fetcher('https://api.github.com/test');

    expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/test', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Repository-Search'
      }
    });
  });
});
