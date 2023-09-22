import { useDispatch } from "react-redux";
import useStoreSelector from "../hooks/useStoreSelector";
import { MessageLiist, removeMessage } from "../redux/messageSlice";

const GlobalMessageList = () => {
  const messages = useStoreSelector<MessageLiist[]>("messages.list", []);
  const dispatch = useDispatch();
  if (!messages?.length) {
    return "";
  }
  return (
    <div className="message-container">
      {messages?.map((msg, i) => (
        <div
          key={i}
          className={`message-wrapper ${msg.type}`}
          onClick={() => dispatch(removeMessage({ index: i }))}
        >
          <p>{msg.value}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default GlobalMessageList;
