export type Poem = {
  id: number;
  title: string;
  description?: string | null;
  text?: string | null;
  time_create?: string;
  language?: any; // пока так, потому что мы не знаем точный JSON
};

const API_BASE = "http://127.0.0.1:8000"; // если у тебя другой адрес — поменяешь

export async function fetchPoems(): Promise<Poem[]> {
  const res = await fetch(`${API_BASE}/api/v1/poetrylist/`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as Poem[];
}
