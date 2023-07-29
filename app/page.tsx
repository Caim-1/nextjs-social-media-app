import Feed from "@/components/Feed";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const Home = () => {
  return (
    <section className="home_grid my-10 mx-6">
      <LeftSidebar />
      <Feed />
      <RightSidebar />
    </section>
  );
};

export default Home;
