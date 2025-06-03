'use client';

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { ApplicationFormState, createApplication } from '../actions/create';
import './ApplicationForm.css';
import ActivitySelect from './ActivitySelect';

type Props = {
  onSuccess: () => void;
};

const activityList = [
  'Fotboll',
  'Simning',
  'Friidrott',
  'Dans',
  'Teater',
  'Musik',
  'Konst',
  'Matlagning',
  'Skapande',
  'Lägerbål',
];

const ApplicationForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const [state, formAction, isPending] = useActionState<ApplicationFormState | null, FormData>(
    createApplication,
    null
  );

  useEffect(() => {
    if (state?.success) {
      setSubmitted(true);

      const delay = setTimeout(() => {
        setFormVisible(false);
        setSubmitted(false);
        onSuccess();
      }, 3000);

      return () => clearTimeout(delay);
    } else if (state?.formData) {
      setFormData({
        name: state.formData.name || '',
        email: state.formData.email || '',
      });
      setSelectedActivities(state.formData.activities || []);
    }
  }, [state, onSuccess]);

  const addActivity = (activity: string) => {
    if (
      activity &&
      !selectedActivities.includes(activity) &&
      selectedActivities.length < 3 &&
      activityList.includes(activity)
    ) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const removeActivity = (activity: string) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const availableActivities = activityList.filter((a) => !selectedActivities.includes(a));

  return (
    <>
      {formVisible && (
        <form
          action={formAction}
          aria-labelledby="form-title"
          className="form-container"
          noValidate
        >
          <div>
            <h2 id="form-title" className="form-title">
              Anmälan lägerverksamhet
            </h2>
            <p className="form-description">
              Fyll i formuläret nedan för att anmäla dig till lägerverksamhet 2025
            </p>
          </div>

          {state?.errors && state.errors._form && (
            <div role="alert" className="error-message">
              {state.errors._form.join(', ')}
            </div>
          )}

          <fieldset className="fieldset">
            <legend className="legend">Personuppgifter</legend>

            <div className="input-container">
              <label htmlFor="name" className="label">
                För- och efternamn{' '}
                <span aria-hidden="true" className="label-required">
                  Obligatoriskt fält
                </span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                aria-required="true"
                className={`input ${state?.errors?.name ? 'input-error' : ''}`}
                placeholder="Ditt namn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-describedby={state?.errors?.name ? 'error-name' : undefined}
                aria-invalid={!!state?.errors?.name}
              />
              {state?.errors?.name && (
                <p id="error-name" className="error-message" role="alert">
                  {state.errors.name.join(', ')}
                </p>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="email" className="label">
                E-post{' '}
                <span aria-hidden="true" className="label-required">
                  Obligatoriskt fält
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-required="true"
                className={`input ${state?.errors?.email ? 'input-error' : ''}`}
                placeholder="exempel@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-describedby={state?.errors?.email ? 'error-email' : undefined}
                aria-invalid={!!state?.errors?.email}
              />
              {state?.errors?.email && (
                <p id="error-email" className="error-message" role="alert">
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="fieldset fieldset-activity">
            <legend className="legend">Aktiviteter</legend>

            {selectedActivities.map((activity, i) => (
              <input key={i} type="hidden" name={`activity-${i}`} value={activity} />
            ))}

            <div
              className={`chip-container ${selectedActivities.length === 0 ? 'empty' : ''}`}
              aria-live="polite"
              aria-label="Valda aktiviteter"
            >
              {selectedActivities.map((activity) => (
                <div key={activity} className="chip">
                  <span>{activity}</span>
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    aria-label={`Ta bort aktiviteten ${activity}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <ActivitySelect
              availableActivities={availableActivities}
              selectedActivities={selectedActivities}
              addActivity={addActivity}
            />

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {selectedActivities.length === 0
                ? 'Inga aktiviteter valda'
                : `Valda aktiviteter: ${selectedActivities.join(', ')}`}
            </div>
          </fieldset>

          {state?.message && !isPending && (
            <p role="alert" className={state.success ? 'success-message' : 'error-message'}>
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || selectedActivities.length !== 3}
            className="button"
            aria-busy={isPending}
          >
            {isPending ? 'Skickar...' : 'Skicka in anmälan'}
          </button>

          {submitted && (
            <div className="confirmation-message" role="status">
              ✅ Din anmälan har skickats!
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default ApplicationForm;
