// lib/useAppwrite.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = <T>(fn: () => Promise<T>, initialData: T, deps: any[] = []) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      setData(res ?? initialData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
};

export default useAppwrite;