import Avatar from "../Avatar/Avatar";
import "./AvatarSidebar.css";

type Props = {
  onReady?: (controls: {
    startTalking: () => void;
    stopTalking: () => void;
  }) => void;
};

export default function AvatarSidebar({ onReady }: Props) {
  return (
    <div className="avatarWrapper">
      <div className="avatarCanvas">
          <Avatar onReady={onReady}/>
      </div>
    </div>
    );
}
