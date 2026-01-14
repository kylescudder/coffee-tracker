import { FormEvent, useMemo, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";

const defaultForm = {
  doseGrams: "18",
  yieldGrams: "36",
  timeSeconds: "28",
  notes: "",
};

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const extractions = useQuery(api.coffee.listExtractions) ?? [];
  const createExtraction = useMutation(api.coffee.createExtraction);

  const isSubmitDisabled = useMemo(
    () => !form.doseGrams || !form.yieldGrams || !form.timeSeconds,
    [form]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await createExtraction({
        doseGrams: Number(form.doseGrams),
        yieldGrams: Number(form.yieldGrams),
        timeSeconds: Number(form.timeSeconds),
        notes: form.notes || undefined,
      });
      setForm(defaultForm);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to save extraction.";
      setError(message);
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Coffee Tracker</p>
          <h1>Track espresso extraction time and yield</h1>
          <p className="subhead">
            Log your shots, compare ratios, and keep consistency across your
            puck prep workflow.
          </p>
        </div>
        <div className="auth">
          <p className="auth__label">Authentication</p>
          {isLoading ? (
            <span className="chip">Checking session…</span>
          ) : isAuthenticated ? (
            <span className="chip chip--success">Signed in</span>
          ) : (
            <div className="auth__prompt">
              <span className="chip chip--warning">Signed out</span>
              <p>
                Connect an auth provider in Convex, then launch the auth UI
                with your provider button.
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="content">
        <section className="card">
          <h2>Log a new extraction</h2>
          <p className="muted">
            Capture dose, yield, and time to track your espresso performance.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Dose (g)
              <input
                inputMode="decimal"
                value={form.doseGrams}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    doseGrams: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Yield (g)
              <input
                inputMode="decimal"
                value={form.yieldGrams}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    yieldGrams: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Time (s)
              <input
                inputMode="numeric"
                value={form.timeSeconds}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    timeSeconds: event.target.value,
                  }))
                }
              />
            </label>
            <label className="form__notes">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit" disabled={isSubmitDisabled}>
              Save extraction
            </button>
          </form>
          {error ? <p className="error">{error}</p> : null}
        </section>

        <section className="card">
          <h2>Recent extractions</h2>
          {extractions.length === 0 ? (
            <p className="muted">No extractions logged yet.</p>
          ) : (
            <ul className="list">
              {extractions.map((shot) => (
                <li key={shot._id} className="list__item">
                  <div>
                    <strong>
                      {shot.doseGrams}g in → {shot.yieldGrams}g out
                    </strong>
                    <p className="muted">{shot.timeSeconds}s · {shot.notes ?? "No notes"}</p>
                  </div>
                  <span className="chip">{new Date(shot.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
