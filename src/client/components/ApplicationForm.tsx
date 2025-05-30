"use client";

import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import { ApplicationFormState, createApplication } from "../actions/create";
import "./ApplicationForm.css";

type Props = {
  onSuccess: () => void;
};

const activityList = [
  "Fotboll",
  "Simning",
  "Friidrott",
  "Dans",
  "Teater",
  "Musik",
  "Konst",
  "Matlagning",
  "Skapande",
  "Lägerbål",
];

const ApplicationForm: React.FC<Props> = ({ onSuccess }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState<
    ApplicationFormState | null,
    FormData
  >(createApplication, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
      setSelectedActivities([]);
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

  const availableActivities = activityList.filter(
    (a) => !selectedActivities.includes(a)
  );

  return (
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

      <fieldset className="fieldset">
        <legend className="legend">Personuppgifter</legend>
        <div className="input-container">
          <label htmlFor="name" className="label">
            För- och efternamn{" "}
            <span aria-hidden="true" className="label-required">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            aria-required="true"
            className="input"
            placeholder="Ditt namn"
          />
        </div>

        <div className="input-container">
          <label htmlFor="email" className="label">
            E-post{" "}
            <span aria-hidden="true" className="label-required">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            className="input"
            placeholder="exempel@mail.com"
          />
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="legend">Aktiviteter</legend>

        {selectedActivities.map((activity, i) => (
          <input
            key={i}
            type="hidden"
            name={`activity-${i}`}
            value={activity}
          />
        ))}

        <div
          className={`chip-container ${
            selectedActivities.length === 0 ? "empty" : ""
          }`}
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

        <label htmlFor="activity-select" className="sr-only">
          Välj aktivitet
        </label>
        <select
          id="activity-select"
          aria-describedby="activity-help"
          className="select"
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              addActivity(value);
              e.target.value = "";
            }
          }}
          disabled={selectedActivities.length >= 3}
          defaultValue=""
        >
          <option value="" disabled>
            -- Välj aktivitet --
          </option>
          {availableActivities.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>
        <p id="activity-help" className="helper-text">
          {selectedActivities.length}/3 aktiviteter valda
        </p>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {selectedActivities.length === 0
            ? "Inga aktiviteter valda"
            : `Valda aktiviteter: ${selectedActivities.join(", ")}`}
        </div>
      </fieldset>

      {state?.message && !isPending && (
        <p
          role="alert"
          className={state.success ? "success-message" : "error-message"}
        >
          {state.message}
        </p>
      )}

      {state?.errors && (
        <div role="alert" className="error-message">
          {Object.entries(state.errors).map(([field, msgs]) =>
            msgs.map((msg, idx) => (
              <p key={`${field}-${idx}`}>
                {field === "_form" ? msg : `${field}: ${msg}`}
              </p>
            ))
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || selectedActivities.length !== 3}
        className="button"
        aria-busy={isPending}
      >
        {isPending ? "Skickar..." : "Skicka in anmälan"}
      </button>
    </form>
  );
};

export default ApplicationForm;
