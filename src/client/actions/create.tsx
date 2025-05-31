export interface ApplicationFormState {
  message?: string;
  errors: {
    name?: string[];
    email?: string[];
    activities?: string[];
    _form?: string[];
  };
  formData?: { name?: string; email?: string; activities?: string[] };
  success?: boolean;
}

export async function createApplication(
  prevState: ApplicationFormState | null,
  formData: FormData
): Promise<ApplicationFormState> {
  const name = formData.get('name')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const activities: string[] = [];

  for (let i = 0; i < 3; i++) {
    const activity = formData.get(`activity-${i}`)?.toString().trim() || '';
    if (!activity) {
      return {
        errors: {
          activities: ['Alla 3 aktiviteter måste väljas'],
        },
      };
    }
    activities.push(activity);
  }

  const errors: ApplicationFormState['errors'] = {};
  if (!name) errors.name = ['Namn krävs'];
  if (!email) errors.email = ['E-post krävs'];

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const res = await fetch('http://localhost:3001/applications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, activities }),
    });

    if (!res.ok) {
      const data = await res.json();

      const formattedErrors = formatFieldErrors(data.errors);
      return {
        errors: {
          _form:
            formattedErrors.length > 0
              ? [`Fel i formuläret: ${formattedErrors.join(' | ')}`]
              : [data.error || JSON.stringify(data)],
        },
      };
    }

    return {
      errors: {},
      success: true,
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Något gick fel'],
      },
    };
  }
}

function formatFieldErrors(fieldErrors: Record<string, string[]>): string[] {
  const fieldLabels: Record<string, string> = {
    name: 'Namn',
    email: 'E-post',
    activities: 'Aktiviteter',
  };

  return Object.entries(fieldErrors).flatMap(([field, messages]) =>
    messages.map((msg) => `${fieldLabels[field] || capitalize(field)}: ${msg}`)
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
