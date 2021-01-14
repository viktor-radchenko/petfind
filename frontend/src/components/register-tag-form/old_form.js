import React, { useState, useEffect } from "react"
import axios from "axios";




export default function RegisterTagForm() {
  // Initialise registration form state
  const [tagInfo, setTagInfo] = useState();
  const [tagIdIsValid, setTagIdIsValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [tagId, setTagId] = useState("");
  const [tagName, setTagName] = useState("");
  const [tagImage, setTagImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userState, setUserState] = useState("");

  useEffect(() => {
    let timer;
    if (tagId.length === 6) {
      timer = setTimeout(() => {
        const fetchTagId = async () => {
          const result = await axios(`/api/tag-id-lookup/${tagId}`);
          setTagInfo(result.data.message);
        };

        fetchTagId();

        tagInfo === "Tag ID is valid for registration" ? setTagIdIsValid(true) : setTagIdIsValid(false);
      }, 1000);
    } else {
      setTagIdIsValid(false);
    }
    return () => clearTimeout(timer);
  }, [tagId]);

  const handleNextStep = () => {
    // submit first form and switch to the next
    if (currentStep === 1 && tagIdIsValid) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      currentStep: currentStep,
      tagId: tagId,
      tagName: tagName,
      tagImage: tagImage,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
      city: city,
      country: country,
      zipCode: zipCode,
      userState: userState,
    });
  };

  const handleTagId = (event) => {
    console.log(tagId);
    console.log(event.target.value);
    setTagId(event.target.value);
  };
  const handleTagName = (event) => {
    console.log(tagName);
    console.log(event.target.value);
    setTagName(event.target.value);
  };
  const handleTagImage = (event) => {
    setTagImage(event.target.files[0]);
  };
  const handleFirstName = (event) => {
    console.log(firstName);
    console.log(event.target.value);
    setFirstName(event.target.value);
  };
  const handleLastName = (event) => {
    console.log(lastName);
    console.log(event.target.value);
    setLastName(event.target.value);
  };
  const handlePhone = (event) => {
    console.log(phone);
    console.log(event.target.value);
    setPhone(event.target.value);
  };
  const handleEmail = (event) => {
    console.log(email);
    console.log(event.target.value);
    setEmail(event.target.value);
  };
  const handleAddress = (event) => {
    console.log(address);
    console.log(event.target.value);
    setAddress(event.target.value);
  };
  const handleCity = (event) => {
    console.log(city);
    console.log(event.target.value);
    setCity(event.target.value);
  };
  const handleCountry = (event) => {
    console.log(country);
    console.log(event.target.value);
    setCountry(event.target.value);
  };
  const handleZipCode = (event) => {
    console.log(zipCode);
    console.log(event.target.value);
    setZipCode(event.target.value);
  };
  const handleUserState = (event) => {
    console.log(userState);
    console.log(event.target.value);
    setUserState(event.target.value);
  };

  return (
    <>
      <h1>Register Tag</h1>
      <p>Step {currentStep}</p>

      <form onSubmit={handleSubmit}>
        <Step1
          currentStep={currentStep}
          handleFileChange={handleTagImage}
          setTagId={handleTagId}
          setTagName={handleTagName}
          onStepChange={handleNextStep}
          tagIdIsValid={tagIdIsValid}
        />
        <Step2
          currentStep={currentStep}
          setFirstName={handleFirstName}
          setLastName={handleLastName}
          setPhone={handlePhone}
          setEmail={handleEmail}
          setAddress={handleAddress}
          setCity={handleCity}
          setUserState={handleUserState}
          setCountry={handleCountry}
          setZipCode={handleZipCode}
          handleSubmit={handleSubmit}
        />
      </form>
    </>
  );
}

function Step1(props) {
  if (props.currentStep !== 1) {
    // Prop: The current step
    return null;
  }

  return (
    <>
      <div className='form-group'>
        <input
          id='tag-image'
          type='file'
          accept='image/png, image/jpeg'
          className='form-control-file'
          onChange={props.handleFileChange}
        />
      </div>
      <div className='form-group'>
        <label htmlFor='tag-id'>Tag ID</label>
        <input
          className='form-control'
          id='tag-id'
          name='tag-id'
          type='text'
          maxLength='6'
          placeholder='Enter tag id'
          value={props.tagId} // Prop: The tag input data
          onChange={props.setTagId} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='tag-name'>Tag name</label>
        <input
          className='form-control'
          id='tag-name'
          name='tag-name'
          type='text'
          placeholder='Enter tag name'
          value={props.tagName} // Prop: The email input data
          onChange={props.setTagName} // Prop: Puts data into state
        />
      </div>
      <button disabled={!props.tagIdIsValid} type='button' onClick={props.onStepChange}>
        Next Step
      </button>
    </>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    // Prop: The current step
    return null;
  }

  return (
    <>
      <div className='form-group'>
        <label htmlFor='user-first-name'>First Name</label>
        <input
          className='form-control'
          id='user-first-name'
          name='user-first-name'
          type='text'
          placeholder='First Name'
          value={props.firstName} // Prop: The tag input data
          onChange={props.setFirstName} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-last-name'>Last Name</label>
        <input
          className='form-control'
          id='user-last-name'
          name='user-last-name'
          type='text'
          placeholder='Last Name'
          value={props.lastName} // Prop: The tag input data
          onChange={props.setLastName} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-phone'>Phone</label>
        <input
          className='form-control'
          id='user-phone'
          name='user-phone'
          type='tel'
          placeholder='Phone number'
          value={props.phone} // Prop: The tag input data
          onChange={props.setPhone} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-email'>Email</label>
        <input
          className='form-control'
          id='user-email'
          name='user-email'
          type='email'
          placeholder='Email'
          value={props.email} // Prop: The tag input data
          onChange={props.setEmail} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-address'>Address</label>
        <input
          className='form-control'
          id='user-address'
          name='user-address'
          type='text'
          placeholder='Address'
          value={props.address} // Prop: The tag input data
          onChange={props.setAddress} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-city'>City</label>
        <input
          className='form-control'
          id='user-city'
          name='user-city'
          type='text'
          placeholder='City'
          value={props.city} // Prop: The tag input data
          onChange={props.setCity} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-state'>State</label>
        <input
          className='form-control'
          id='user-state'
          name='user-state'
          type='text'
          placeholder='State'
          value={props.userState} // Prop: The tag input data
          onChange={props.setUserState} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-country'>Country</label>
        <input
          className='form-control'
          id='user-country'
          name='user-country'
          type='text'
          placeholder='Counry'
          value={props.country} // Prop: The tag input data
          onChange={props.setCountry} // Prop: Puts data into state
        />
      </div>
      <div className='form-group'>
        <label htmlFor='user-zip'>Zip</label>
        <input
          className='form-control'
          id='user-zip'
          name='user-zip'
          type='text'
          placeholder='Zip Code'
          value={props.zipCode} // Prop: The tag input data
          onChange={props.setZipCode} // Prop: Puts data into state
        />
      </div>
      <button type='submit'>Submit form</button>
    </>
  );
}