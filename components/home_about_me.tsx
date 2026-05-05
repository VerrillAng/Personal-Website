import styles from "./home_about_me.module.css";

function HomeAboutMe() {
  return (
    <div className="h-[100vh] w-[100vw] bg-[#F9EFDD] p-6">
      <div className={`w-full h-full rounded-2xl ${styles.window}`}>
        {/* content goes here */}
      </div>
    </div>
  );
}

export default HomeAboutMe;
