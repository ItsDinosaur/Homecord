import exampleReactIcon from "../assets/react.svg"
import "../appearance/UserProfilePage.css"
import List from "../types/List";
import { userOption } from "../types/Interfaces";

interface UserOptionsProps {
  userOptions: userOption[];
}

const renderUserOptions = (userOption: userOption) => {
    return (
        <div onClick={() => onSelectChannel(channel)}>
            <ChannelElement channel={channel} />
        </div>
    );
};

function UserProfilePage({ userOptions }: UserOptionsProps) {
    return (
        <div className="user-profile-page">
            <div className="user-profile-header">
                <img src={exampleReactIcon} className="user-profile-page-icon" alt="User Profile Page Icon" />            
                Username: user
            </div>
            <div className="user-profile-info">
                <List
                    items={userOptions} 
                    renderItem={(userOptions) => renderUserOptions(userOptions)}
                />
            </div>
        </div>
    );
}
export default UserProfilePage;