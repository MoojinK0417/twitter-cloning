
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";



const Profile = ({userObj}) => {

    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange =(event)=>{
        const{
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){

            await userObj.updateProfile({
                displayName: newDisplayName,
              });
        }
    }

    const getMyNweets = async() => {
    
        const nweets = await dbService.collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();

        console.log(nweets.docs.map((doc) => doc.data()));
    };

    useEffect(() => {

        getMyNweets();

    }, []);

    return(
        <div>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Display name"  value={newDisplayName}/>
            <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log out</button>
       
        </div>

    );
};


export default Profile;

