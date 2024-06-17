import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlySleepLogs } from "../../features/avergeSlice";
import { AppDispatch, RootState } from "../../app/store";

function formatTimeString(timeString: string): string {
  const parts = timeString.split(":");
  if (parts[0].length === 1) {
    parts[0] = `0${parts[0]}`;
  }
  const normalizedTimeString = parts.join(":");
  const date = new Date(`1970-01-01T${normalizedTimeString}Z`);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC"
  };

  return date.toLocaleTimeString("en-US", options);
}

const handleFeeling = (feeling: number): string => {
  switch (feeling) {
    case 1: {
      return "Bad";
    }
    case 2: {
      return "OK";
    }
    case 3: {
      return "Good";
    }
    default: {
      return "";
    }
  }
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: {
      return "st";
    }
    case 2: {
      return "nd";
    }
    case 3: {
      return "rd";
    }
    default: {
      return "th";
    }
  }
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric"
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);

  const formattedDate = formatter.format(date);

  const day = date.getDate();
  const suffix = getDaySuffix(day);

  return `${formattedDate}${suffix}`;
};

interface AverageViewProperties {
  onBack: () => void;
}

export function AverageViewComponent({ onBack }: AverageViewProperties) {
  const dispatch = useDispatch<AppDispatch>();
  const sleep = useSelector((state: RootState) => state.average);
  const avergeTimeinBed = sleep.average_total_time_in_bed.split(":");

  useEffect(() => {
    dispatch(fetchMonthlySleepLogs());
  }, [dispatch]);

  if (sleep.status === "loading") {
    return <div>Loading...</div>;
  }

  if (sleep.status === "failed") {
    return <div>Error: {sleep.error}</div>;
  }

  return (
    <div className="average-view-container">
      <button type="button" onClick={onBack}>
        BACK
      </button>
      {sleep && (
        <div>
          <div>
            {formatDate(sleep.range.start_date)} to{" "}
            {formatDate(sleep.range.end_date)}
          </div>
          <div>{`${avergeTimeinBed[0]} h ${avergeTimeinBed[0]} m`}</div>
          <div>
            {formatTimeString(sleep.average_bed_time_start)} -{" "}
            {formatTimeString(sleep.average_bed_time_end)}
          </div>
          {sleep.feeling_frequencies.map((feel) => (
            <div key={feel.feeling}>
              {handleFeeling(feel.feeling)}: {feel.count}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
