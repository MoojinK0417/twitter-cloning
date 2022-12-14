import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import  Nweet  from "components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({userObj}) => {
    uuidv4();

    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");


    useEffect(() => { 
   
       dbService.collection("nweets").onSnapshot(snapshot => {
          const nweetArray = snapshot.docs.map(doc => ({
              id:doc.id,
              ...doc.data(),
        }));
        setNweets(nweetArray);
       });
    }, []);


    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
        const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(fileRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
        }
        
       

        console.log(attachmentUrl);
        // const attachmentUrl = await response.ref.attachmentUrls;
        
        const nweetObj = {
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");

    };

  
    const onChange = (event) => {
        const { target:{value},
    } = event;
    setNweet(value);
    };

   const onFileChange = (event) => {
       const {target: {files},
    } = event;
    const theFile = files[0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
        const {currentTarget: {result},
    } = finishedEvent;
        setAttachment(result);
    };
    reader.readAsDataURL(theFile);


   };

   const onClearAttachment = () => {setAttachment("")};
return (
<div>
    <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Nweet" />
        {attachment &&(
         <div>
            <img src={attachment} alt="img" width="50px" height="50px"/>
            <button onClick={onClearAttachment}>Clear</button>
            
            </div>
            )}
    </form>

    <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
        ))}
    </div>

</div>
);
};
export default Home;