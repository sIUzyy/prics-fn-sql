// ---- components ----
import ScannedTimeIn from "@/components/security-components/scanned-time-in";
import Heading from "@/components/header/page-heading";

// ---- security time-in page
export default function SecurityTimeIn() {
  return (
    <div className="m-5">
      <Heading
        title={"Time In"}
        description={`Click the button to scan the driver's barcode for gate pass.`}
      />
      <div className="max-w-[350px]">
        <ScannedTimeIn />
      </div>
    </div>
  );
}
