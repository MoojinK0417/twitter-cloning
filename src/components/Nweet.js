import { dbService, storageService} from "fbase";
import React, {useState} from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";


const Nweet = ({nweetObj, isOwner }) => {

    const NweetTextRef =doc(dbService, "nweets", `${nweetObj.id}`);

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if(ok){
            await deleteDoc(NweetTextRef);
            await deleteObject(ref(storageService, nweetObj.attachmentUrl));
         
         
        };
    };


    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();

        await updateDoc(NweetTextRef, {
            text: newNweet,
            });
            setEditing(false);
       
    }
    const onChange = (event) => {
        const {target: {value},
    } = event;
    setNewNweet(value);
    };
 

 return (
    <div>
        {
            editing ? (
            <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your twit" value={newNweet} required onChange={onChange}/>
                <input type="submit" value="Update Tweet"/>
            </form>
            <button onClick={toggleEditing}>CanCel</button>
            </>
            ) :(
            <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && (<img src={nweetObj.attachmentUrl} alt="img" width="50px" height="50px"/>)}
         

        {isOwner && (
        <>
        <button onClick={onDeleteClick}>Delete Nweet</button>
        <button onClick={toggleEditing}>Edit Nweet</button>
        </>
        )}
        </>
        )}

        

    </div>
);


};


export default Nweet;