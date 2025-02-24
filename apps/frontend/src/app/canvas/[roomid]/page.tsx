
import ExcaliSketch from "../../../components/ui/excelidraw"
import Canvas from "../../../components/ui/canvas"

export default async function HomePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const param = await params;

  return (
    <div>
      {/* <Canvas /> */}
      <ExcaliSketch roomId={parseInt(param.roomId)} />
    </div>
  );
}
