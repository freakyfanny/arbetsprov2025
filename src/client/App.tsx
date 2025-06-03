import { useEffect, useState } from 'react';
import ApplicationForm from './components/ApplicationForm';
import './app.css';
import ErrorDialog from './components/ErrorDialog';
import { useQuery } from '@tanstack/react-query';

type Application = {
  id: string;
  name: string;
  email: string;
  activities: string[];
  createdAt: string;
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: applications = [],
    error: queryError,
    isLoading,
    refetch,
  } = useQuery<Application[], Error>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/applications/get');
      if (!res.ok) {
        throw new Error('Failed to fetch applications');
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (queryError) setError(queryError.message);
  }, [queryError]);

  useEffect(() => {
    if (!showForm) refetch();
  }, [showForm]);

  const closeErrorDialog = () => {
    setError(null);
  };

  return (
    <main>
      <h1 tabIndex={0}>Anmälningar till lägerverksamhet</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        aria-expanded={showForm}
        aria-controls="application-form"
        className="button"
      >
        {showForm ? 'Stäng formulär' : 'Skapa ny anmälan'}
      </button>

      {showForm && (
        <div id="application-form">
          <ApplicationForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <ul aria-label="Lista över anmälningar" aria-live="polite" className="application-list">
        {applications.length === 0 ? (
          <li>Finns inga anmälningar just nu</li>
        ) : (
          applications.map((app) => (
            <li key={app.id}>
              <h2 tabIndex={0}>{app.name}</h2>
              <a
                href={`mailto:${app.email}`}
                id={`email-${app.id}`}
                aria-label={`E-postadress för ${app.name}`}
              >
                {app.email}
              </a>

              <p id={`activities-label-${app.id}`}>{app.name} är intresserad av:</p>
              <ul className="activity-list" aria-labelledby={`activities-label-${app.id}`}>
                {app.activities.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
      {error && <ErrorDialog errorMessage={error} onClose={closeErrorDialog} />}
    </main>
  );
}

export default App;
