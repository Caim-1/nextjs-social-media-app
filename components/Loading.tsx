import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <div className="profile flex-center">
      <ReactLoading type="spokes" color="black" height={"20%"} width={"20%"} />
    </div>
  );
};

export default Loading;
