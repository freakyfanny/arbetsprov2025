export interface ApplicationFormState {
  message?: string;  
  errors: {
    name?: string[];
    email?: string[];
    activities?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createApplication(
  prevState: ApplicationFormState | null,
  formData: FormData
): Promise<ApplicationFormState>  {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const activities: string[] = [];

  // Validate activities
  for (let i = 0; i < 3; i++) {
    const activity = formData.get(`activity-${i}`)?.toString().trim() || "";
    if (!activity) {
      return {
        errors: {
          activities: ["Alla 3 aktiviteter måste väljas"],
        },
      };
    }
    activities.push(activity);
  }

  const errors: ApplicationFormState["errors"] = {};
  if (!name) errors.name = ["Namn krävs"];
  if (!email) errors.email = ["E-post krävs"];

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const res = await fetch("http://localhost:3001/applications/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, activities }),
    });

    if (!res.ok) {
      const data = await res.json();

      return {
        errors: {
          _form: [
            "Fel i formuläret: " +
              JSON.stringify(data.errors?.fieldErrors || data.error || data),
          ],
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
        _form: [(error instanceof Error ? error.message : "Något gick fel")],
      },
    };
  }
}