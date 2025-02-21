

import Canvas from "../../../components/ui/canvas"

export default async function HomePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const param = await params;

  return (
    <div>
      <Canvas />
    </div>
  );
}
