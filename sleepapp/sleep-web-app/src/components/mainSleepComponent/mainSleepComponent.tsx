import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchSleepData } from "../../features/sleepSlice";
import { SleepInfoComponent } from "../sleepInfo/sleepInfo";
import { SleepFormComponent } from "../sleepForm/sleepForm";
import { AverageViewComponent } from "../avergeSleepComponent/avergeSleepComponent";

export function MainComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const sleepData = useSelector((state: RootState) => state.sleep);
  const [view, setView] = React.useState<"info" | "form" | "average">("info");

  useEffect(() => {
    dispatch(fetchSleepData());
  }, [dispatch, view]);

  if (sleepData.status === "loading") {
    return <div>Loading...</div>;
  }

  if (sleepData.status === "failed") {
    return <div>Error: {sleepData.error}</div>;
  }

  return (
    <div className="app-container">
      {view === "info" && (
        <SleepInfoComponent
          onLogSleep={() => setView("form")}
          onViewAverage={() => setView("average")}
        />
      )}
      {view === "form" && (
        <SleepFormComponent
          onSave={() => {
            fetchSleepData();
            setView("info");
          }}
          onCancel={() => setView("info")}
        />
      )}
      {view === "average" && (
        <AverageViewComponent onBack={() => setView("info")} />
      )}
    </div>
  );
}
