import { useMemo, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ConvexProvider, ConvexReactClient, useConvexAuth, useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("EXPO_PUBLIC_CONVEX_URL is not set. Add it to apps/mobile/.env.");
}

const convex = new ConvexReactClient(convexUrl);

const defaultForm = {
  doseGrams: "18",
  yieldGrams: "36",
  timeSeconds: "28",
  notes: "",
};

function TrackerScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const extractions = useQuery(api.coffee.listExtractions) ?? [];
  const createExtraction = useMutation(api.coffee.createExtraction);

  const isSubmitDisabled = useMemo(
    () => !form.doseGrams || !form.yieldGrams || !form.timeSeconds,
    [form]
  );

  const handleSubmit = async () => {
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Coffee Tracker</Text>
        <Text style={styles.title}>Log espresso extractions</Text>
        <Text style={styles.subtitle}>
          Capture dose, yield, and time to keep your shots consistent.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authentication</Text>
          {isLoading ? (
            <Text style={styles.muted}>Checking session…</Text>
          ) : isAuthenticated ? (
            <Text style={styles.success}>Signed in</Text>
          ) : (
            <Text style={styles.warning}>
              Signed out — connect your provider in Convex and launch the auth UI
              from your app shell.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>New extraction</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={form.doseGrams}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, doseGrams: value }))
            }
            placeholder="Dose (g)"
          />
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={form.yieldGrams}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, yieldGrams: value }))
            }
            placeholder="Yield (g)"
          />
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={form.timeSeconds}
            onChangeText={(value) =>
              setForm((prev) => ({ ...prev, timeSeconds: value }))
            }
            placeholder="Time (s)"
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.notes}
            onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))}
            placeholder="Notes"
            multiline
          />
          <Button title="Save extraction" onPress={handleSubmit} disabled={isSubmitDisabled} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent extractions</Text>
          {extractions.length === 0 ? (
            <Text style={styles.muted}>No extractions logged yet.</Text>
          ) : (
            extractions.map((shot) => (
              <View key={shot._id} style={styles.listItem}>
                <Text style={styles.listTitle}>
                  {shot.doseGrams}g → {shot.yieldGrams}g
                </Text>
                <Text style={styles.muted}>{shot.timeSeconds}s</Text>
                <Text style={styles.muted}>{shot.notes ?? "No notes"}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <TrackerScreen />
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  container: {
    padding: 24,
    gap: 16,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    color: "#7a7a7a",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    borderColor: "#d0d5dd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  textarea: {
    minHeight: 80,
  },
  listItem: {
    padding: 12,
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    gap: 4,
  },
  listTitle: {
    fontWeight: "600",
  },
  muted: {
    color: "#6b7280",
  },
  success: {
    color: "#05603a",
    fontWeight: "600",
  },
  warning: {
    color: "#92400e",
  },
  error: {
    color: "#b42318",
  },
});
