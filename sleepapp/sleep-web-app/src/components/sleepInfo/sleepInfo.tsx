import React from "react";
import { useSelector } from "react-redux";
import { differenceInMinutes, parseISO, format } from "date-fns";
import { RootState } from "../../app/store";

interface SleepInfoProperties {
  onLogSleep: () => void;
  onViewAverage: () => void;
}

const handleDataFeeling = (n: number) => {
  let result;

  if (n === 1) {
    result = "Bad";
  }

  if (n === 2) {
    result = "OK";
  }

  if (n === 3) {
    result = "Good";
  }

  return result;
};

function formatTime(time: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC"
  };

  const startDate = new Date(time);
  const formattedTime = startDate.toLocaleTimeString("en-US", options);

  return formattedTime;
}

const formatDate = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, "MMMM do");
};

export function SleepInfoComponent({
  onLogSleep,
  onViewAverage
}: SleepInfoProperties) {
  const sleepData = useSelector((state: RootState) => state.sleep);
  const date = new Date().toISOString().split("T")[0];
  const start = parseISO(sleepData.bed_time_start);
  const end = parseISO(sleepData.bed_time_end);
  const difference = differenceInMinutes(end, start);
  const timeInBed = `${Math.trunc(difference / 60)} h ${difference % 60} m`;

  return (
    <div className="sleep-info-container">
      {sleepData.feeling ? (
        <div>
          <div>{formatDate(date)}</div>
          <div>
            {`${formatTime(sleepData.bed_time_start)} to ${formatTime(
              sleepData.bed_time_end
            )}`}
          </div>
          <div>{timeInBed}</div>
          {sleepData.feeling && (
            <div>You felt: {handleDataFeeling(+sleepData.feeling)}</div>
          )}

          <button type="button" onClick={onViewAverage}>
            AVG
          </button>
        </div>
      ) : (
        <div>
          <div>No sleep information</div>
          <button type="button" onClick={onLogSleep}>
            +
          </button>
        </div>
      )}
    </div>
  );
}
