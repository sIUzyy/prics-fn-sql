// loading logo
import loading_logo from "../../assets/nav_logo.webp";

// this loading will show if loading
export default function LazyLoading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={loading_logo} alt="loading-logo" className="w-[200px]" />
    </div>
  );
}
