import { renderHook, act } from '@testing-library/react';
import { useApi } from './useApi';

const mockSession = {
  access_token: 'test-token',
} as any;

const baseUrl = 'http://localhost/api';

describe('useApi', () => {
  let globalFetch: typeof global.fetch;

  beforeEach(() => {
    globalFetch = global.fetch;
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    (global as any).fetch = globalFetch;
    jest.clearAllMocks();
  });

  it('should perform GET request and set data', async () => {
    const responseData = { foo: 'bar' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(responseData),
    });

    const { result } = renderHook(() => useApi(mockSession, baseUrl));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.get('/test');
    });

    await act(async () => {
      await promise;
    });

    expect(fetch).toHaveBeenCalledWith(
      baseUrl + '/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockSession.access_token}`,
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result.current.data).toEqual(responseData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should perform POST request with body', async () => {
    const responseData = { id: 1 };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(responseData),
    });

    const { result } = renderHook(() => useApi(mockSession, baseUrl));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.post('/test', { name: 'test' });
    });

    await act(async () => {
      await promise;
    });

    expect(fetch).toHaveBeenCalledWith(
      baseUrl + '/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      })
    );
    expect(result.current.data).toEqual(responseData);
  });

  it('should perform PUT request with body', async () => {
    const responseData = { updated: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(responseData),
    });

    const { result } = renderHook(() => useApi(mockSession, baseUrl));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.put('/test', { name: 'updated' });
    });

    await act(async () => {
      await promise;
    });

    expect(fetch).toHaveBeenCalledWith(
      baseUrl + '/test',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'updated' }),
      })
    );
    expect(result.current.data).toEqual(responseData);
  });

  it('should perform DELETE request', async () => {
    const responseData = { deleted: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(responseData),
    });

    const { result } = renderHook(() => useApi(mockSession, baseUrl));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.del('/test');
    });

    await act(async () => {
      await promise;
    });

    expect(fetch).toHaveBeenCalledWith(
      baseUrl + '/test',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result.current.data).toEqual(responseData);
  });

  it('should handle error response', async () => {
    const errorData = { message: 'Error' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce(errorData),
    });

    const { result } = renderHook(() => useApi(mockSession, baseUrl));

    let error;
    let promise: Promise<any>;
    act(() => {
      promise = result.current.get('/fail').catch((e: unknown) => (error = e));
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.error).toEqual(errorData);
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
