import React from 'react';

interface ActivitySelectProps {
  availableActivities: string[];
  selectedActivities: string[];
  addActivity: (activity: string) => void;
}

const ActivitySelect: React.FC<ActivitySelectProps> = ({
  availableActivities,
  selectedActivities,
  addActivity,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      addActivity(value);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label htmlFor="activity-select" className="sr-only">
        Välj aktivitet
      </label>
      <select
        id="activity-select"
        aria-describedby="activity-help"
        className="select"
        onChange={handleChange}
        disabled={selectedActivities.length >= 3}
        value=""
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
        {selectedActivities.length < 1
          ? 'Välj tre aktiviteter du är intresserad av'
          : `${selectedActivities.length}/3 aktiviteter valda`}
      </p>
    </div>
  );
};

export default ActivitySelect;
