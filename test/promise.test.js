import { CustomPromise } from '../src/index';

describe('CustomPromise', () => {
  it('should resolve with the correct value', async () => {
    const result = await CustomPromise.resolve(42);
    expect(result).toBe(42);
  });

  it('should reject with an error', async () => {
    expect.assertions(1);
    try {
      await CustomPromise.reject('Error!');
    } catch (error) {
      expect(error).toBe('Error!');
    }
  });

  it('should correctly chain thenable methods', async () => {
    const promise = new CustomPromise<number>((resolve, reject) => {
      setTimeout(() => resolve(10), 100);
    });

    const result = await promise
      .then(value => value * 2)
      .then(value => value + 1);

    expect(result).toBe(21);
  });

  it('should handle errors with catch', async () => {
    const promise = new CustomPromise<number>((resolve, reject) => {
      setTimeout(() => reject('Failure'), 100);
    });

    const result = await promise
      .catch(reason => reason === 'Failure' ? 'Handled Failure' : 'Unhandled');
    
    expect(result).toBe('Handled Failure');
  });

  it('should support static delay', async () => {
    const start = Date.now();
    await CustomPromise.delay(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});