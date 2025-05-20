import React from 'react'
import "../../assets/css/privacy.scss";

const Privacy = () => {

const data = [
    {
        text:'accessible at Website.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Website Name and how we use it.'
    },
    {
        text:' If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at Email@Website.com'
    },
    {
        text:'This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Website Name. This policy is not applicable to any information collected offline or via channels other than this website.'
    },
    {
        text:'Consent'
    },
    {
        text:'By using our website, you hereby consent to our Privacy Policy and agree to its terms.'
    },
    {
        text:'Information we collect'
    },
    {
        text:'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.'
    },
    {
        text:'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.'
    },
    {
        text:'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.'
    },
]

  return (
    <div className="fluid-container" style={{overflowX:"hidden"}}>

<div className='d-flex justify-content-between align-items-center privacy1 px-3'>
<div className="" style={{width:"10%"}}>
<i class=" fa-solid fa-arrow-left"></i>
</div>

{/* <p className='mb-0 text-center'>Terms & Conditions</p> */}

<div className="" style={{width:"90%"}}>
<div className="row">
    <div className="col-12 d-flex justify-content-center">
    <span>Terms & Conditions</span>
    </div>
</div>
</div>
</div>

        {/* <div className="row privacy1 px-3" >
            <div className="col-1  d-flex justify-content-between align-items-center">
           <i class=" fa-solid fa-arrow-left"></i>
            
            </div>

            <div className="col-11 d-flex justify-content-center align-items-center" style={{width:"100%"}}>
            <span>Terms & Conditions</span>
            </div>

        </div> */}

        <div className="row privacy2 py-3 px-3">
            <div className="col-12  d-flex justify-content-between align-items-center">
            <span>Privacy policy</span>
            
            </div>

            

        </div>


        <div className="row privacy3  px-3">

        <div className="col-12  d-flex justify-content-between align-items-center">
            <span className=''>Privacy Policy for Company Name At Website Name,</span>
            
            </div>

{
    data.map(({text})=>{
        return(
<div className="col-12  d-flex justify-content-between align-items-center">
            <span className='pb-4'>{text}</span>
            
            </div>
        )
    })
}
            

            

        </div>


    </div>
  )
}

export default Privacy