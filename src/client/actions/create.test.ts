import { createApplication, ApplicationFormState } from './create';
import { jest } from '@jest/globals';

describe('createApplication', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  it('should return success when the form is valid', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {
        get: () => null,
      },
      json: async () => ({ message: 'Application saved!' }),
    } as unknown as Response);

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john.doe@example.com');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', 'Swimming');
    formData.append('activity-2', 'Cycling');

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors).toEqual({});
    expect(result.success).toBe(true);
  });

  it('should return validation errors when name is missing', async () => {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('email', 'john.doe@example.com');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', 'Swimming');
    formData.append('activity-2', 'Cycling');

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: { get: () => null },
      json: async () => ({ message: 'Application saved!' }),
    } as unknown as Response);

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors.name).toEqual(['Namn krävs']);
    expect(result.success).toBeUndefined();
  });

  it('should return validation errors when email is missing', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', '');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', 'Swimming');
    formData.append('activity-2', 'Cycling');

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: { get: () => null },
      json: async () => ({ message: 'Application saved!' }),
    } as unknown as Response);

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors.email).toEqual(['E-post krävs']);
    expect(result.success).toBeUndefined();
  });

  it('should return validation errors when activities are missing', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john.doe@example.com');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', '');
    formData.append('activity-2', '');

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: { get: () => null },
      json: async () => ({ message: 'Application saved!' }),
    } as unknown as Response);

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors.activities).toEqual(['Alla 3 aktiviteter måste väljas']);
    expect(result.success).toBeUndefined();
  });

  it('should return form errors if the server responds with an error', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockImplementationOnce(async () => {
      return {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: { get: () => null },
        json: async () => ({
          errors: {
            fieldErrors: {
              name: ['Name is already taken'],
            },
          },
        }),
      } as unknown as Response;
    });

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john.doe@example.com');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', 'Swimming');
    formData.append('activity-2', 'Cycling');

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors._form).toEqual(['Fel i formuläret: {"name":["Name is already taken"]}']);
    expect(result.success).toBeUndefined();
  });

  it('should return error message when there is a network issue', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john.doe@example.com');
    formData.append('activity-0', 'Running');
    formData.append('activity-1', 'Swimming');
    formData.append('activity-2', 'Cycling');

    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network Error'));

    const prevState: ApplicationFormState = { errors: {} };

    const result = await createApplication(prevState, formData);

    expect(result.errors._form).toEqual(['Network Error']);
    expect(result.success).toBeUndefined();
  });
});
