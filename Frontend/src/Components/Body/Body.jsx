import React, { useState } from 'react'
import "./Body.css"
import send_icon from "../../assets/send_icon.png"
import gallery_icon from "../../assets/gallery_icon.png"
import mic_icon from "../../assets/mic_icon.png"
import compass_icon from "../../assets/compass_icon.png"
import bulb_icon from "../../assets/bulb_icon.png"
import message_icon from "../../assets/message_icon.png"
import code_icon from "../../assets/code_icon.png"
import user_icon from "../../assets/user_icon.png"
import logo0 from "../../assets/logo0.png"
import tea_can01 from "../../assets/tea_can01.png"
import { useEffect } from 'react'
export default function Body({setLoading,selectedCountry,subject,collapse,loading,recentPrompt,setRecentPrompt,extend,input,setInput,showResult,setShowResult}) {
  const [answer,setAnswer]=useState()
  const delayPara= (index,nextWord)=>{
    setTimeout(function(){
    setAnswer(prev=>prev+nextWord) 
    },100*index)
}
  const answerChat=async (prompt)=>{
      setAnswer("")
      setShowResult(true)
      setRecentPrompt(prompt)
      setLoading(true)
      let url=`http://127.0.0.1:5000/q/${selectedCountry["value"]}/${(collapse.charAt(collapse.length-1))}/${subject.replaceAll(" ","_")}/${prompt}`
      if(isNaN(collapse.charAt(collapse.length-1))){
         url=`http://127.0.0.1:5000/u/${collapse.split("categoryBook ")[1]}/${subject.replaceAll(" ","_")}/${prompt}`
      }
      await fetch(url).then(response=>response.json()).then(data=>{
      let responseArray= data["ans"].split("**");
      let newResponse="";
        for(let i=0 ; i<responseArray.length; i++){
            if (i===0 || i%2 !==1){
                newResponse+=responseArray[i]
            }else{
                newResponse +="<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("* ").join("<br\>")
        let newResponseArray= newResponse2.split(" ");
        
        for(let i=0; i<newResponseArray.length;i++){
            delayPara(i,newResponseArray[i]+" ")
        }

      }).catch((error) => {
        let newResponseArray= "Sorry but we can't provide what you asked for.".split(" ");
        for(let i=0; i<newResponseArray.length;i++){
            delayPara(i,newResponseArray[i]+" ")
        }
      });
      setLoading(false)
      setInput("")
  }
  useEffect(() => {
    const keyDownHandler = async event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        // await onSent()
        await answerChat(input)
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [input]);

  return (
    <div className={`main${extend?"":" true"}`}>
      <div className="nav">
            <p><img src={logo0} alt="" /></p>
            <img src={tea_can01} alt="" />
        </div>
      <div className="main-container">
      {!showResult ?<>
                <div className="greet">
                <p><span>Hello how can I help you today?</span></p>
                <p></p>
                </div>
                <p>
                 A <b> Quick guide </b>first choose a country and check if the book you are looking for is listed in your respective grade 
                  if the book you are looking for is not listed you can upload a book of your own in <b> PDF </b>format only
                  and give it a category if not it will be added in "All" folder, once you upload the file it is saved and you can use it at any time in the future you don't have to upload it again and again , the next time you login select the catagoy then your book ask your question.
                  </p>
                  <p> <b>Thanks! that will be all.</b></p> 
            </>:
            
            <div className='result'>
                    <div className="result-title">
                        <p>{recentPrompt}</p>
                        <img  src={user_icon} alt="" /> 
                    </div>
                    <div className="result-data">
                    <img className='tea-can' src={tea_can01} alt="" />
                        {loading?
                        <div className="loader">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        </div>:
                       <p dangerouslySetInnerHTML={{__html:answer} }></p>
                        }
                    </div>
                </div>}
          <div className="main-bottom">
                <div className="search-box">
                    <input    onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Ask me anything... " />
                    <div>
                        {input?<img onClick={()=>answerChat(input)} src={send_icon}alt="" />:null}
                    </div>
                </div>
          </div>
      </div>
    </div>
  )
}
