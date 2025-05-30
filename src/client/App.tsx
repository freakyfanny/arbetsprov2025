import { useEffect, useState } from 'react';
import ApplicationForm from './components/ApplicationForm';
import './app.css';
import ErrorDialog from './components/ErrorDialog';

type Application = {
  id: string;
  name: string;
  email: string;
  activities: string[];
  createdAt: string;
};

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/applications/get')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch applications');
        }
        return res.json();
      })
      .then(setApplications)
      .catch((error) => setError(error.message));
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
            <li key={app.id} className="application-card">
              <div className="card-header">
                <h2 tabIndex={0}>{app.name}</h2>
              </div>
              <p>{app.email}</p>
              <ul className="activity-list">
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
