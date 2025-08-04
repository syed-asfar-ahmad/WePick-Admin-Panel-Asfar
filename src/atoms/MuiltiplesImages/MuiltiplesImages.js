import React, { useRef, useState } from 'react';
import './MuiltiplesImages.scss';
import { Modal } from 'antd';
import { CustomToast } from '../toastMessage';
import { useEffect } from 'react';
import usePost from '../../customHook/usePost';

const MuiltiplesImages = ({selectedImages, setSelectedImages, Id, addUrl, deleteUrl, setSelectedImagesCall, selectedImagesCall}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeImg, setRemoveImg] = useState(false);
    const [removeImgId, setRemoveImgId] = useState(false);
    const [errorImage, setErrorImage] = useState([]);
    const fileInputRef = useRef(null);
    const { data, isLoading, error, postData } = usePost();

    useEffect(()=>{
       if(Id &&  selectedImages.some(image => image.name)){
        const formData = new FormData();
        selectedImages.map(m=>(       formData.append("images[]", m)))

        postData( `${addUrl}/${Id}`,
            formData,
            (res) => {
              setSelectedImagesCall(!selectedImagesCall)
            }
          );
       }
    },[selectedImages])

    useEffect(()=>{
        if(Id ){
            const formData = new FormData();
            formData.append('image_ids[]', removeImgId,)
              
            postData( `${deleteUrl}/${Id}`,
            formData,
                (res) => {
                
                }
              );
           }
    },[removeImg])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleButtonClick = () => {
     fileInputRef.current.click()
    };

    const handleImageChange = async (event) => {
        const files = event.target.files;
        const imageArray = Array.from(files);

        // Enforce exactly 4 images
        if (imageArray.length > 4) {
            CustomToast({
                type: "error",
                message: "Please select maximum 4 images.",
            });
            return;
        }

        // Check image dimensions
        let invalidImagesCount = 0;
        let invalidImageNames = [];
        let previouslyInvalidImages = []; // Keep track of previously invalid images

        for (const image of imageArray) {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            await new Promise(resolve => {
                img.onload = () => {
                    if (img.height + img.height === img.width ) {
                        invalidImagesCount++;

                        if (!previouslyInvalidImages.includes(image.name)) {
                            previouslyInvalidImages.push(image.name);
                            invalidImageNames.push(image.name);
                        }
                    }

                    resolve();
                };
            });
        }

        if (invalidImagesCount > 0) {
            setErrorImage({ ...errorImage, invalidImageNames })
        } else {
            setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...imageArray]);
            setErrorImage([]);
        }
    };



    const removeImage = (imageName) => {
        setRemoveImg(!removeImg)
        const updatedImages = selectedImages.filter(image =>  image?.imageUrl !== imageName && image.name !== imageName);
        setSelectedImages(updatedImages);

    };

    const removeAllImages = () => {
        setSelectedImages([]);
        setErrorImage([]);

        if(Id){
            const formData = new FormData();
            selectedImages.forEach(item => {
                formData.append('image_ids[]', item.id);
              });
              
            postData( `${deleteUrl}/${Id}`,
            formData,
                (res) => {
                
                }
              );
           }

    };



    return (
        <>
            <div className="row mt-4" >
                <div className="col-12 mt-lg-0 mt-0  doc-setting-input">
                    <div className="">
                        <span className='border cursor-pointer hospital-slider-image' onClick={showModal}>
                            Select Images
                        </span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />

                    <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={<button className='hospital-slider-image-inner px-5' onClick={handleCancel}>Submit</button>}
                        width={'75%'}
                    >
                        <div className=" d-flex flex-column flex-lg-row justify-content-between align-items-center" style={{ minHeight: '300px' }}>
                            <div className='d-flex justify-content-center w-100'>
                                <div className="hospital-slider-image-inner-show-container">
                                    {selectedImages?.length > 0 ? (
                                        selectedImages?.map((image, index) => (
                                            <div style={{opacity: isLoading ? '0.4': '1'}} className='hospital-slider-image-inner-show border position-relative' key={index}>
                                                <img
                                                    src={ image.name ? URL.createObjectURL(image) : image?.imageUrl}
                                                    alt={`Image ${index}`}
                                                    className="w-100 h-100"
                                                />
                                                <button disabled={isLoading}
                                                    className="delete-button-image position-absolute"
                                                    onClick={() => {removeImage(image.name   ? image?.name : image?.imageUrl)
                                                        setRemoveImgId(image?.id)
                                                    }}
                                                >
                                                    &#10005;
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No images selected.</p>
                                    )}
                                </div>
                            </div>
                            <div className='d-flex flex-column align-items-center w-100'>
                                <div className="d-flex justify-content-center w-100" >
                                    <button disabled={isLoading || selectedImages?.length > 3}
                                    className='d-flex align-items-center border cursor-pointer hospital-slider-image-inner ' onClick={handleButtonClick}>
                                        Select Images
                                    </button>
                                    <button disabled={isLoading}
                                     className='d-flex align-items-center border cursor-pointer hospital-slider-image ml-2 ' onClick={removeAllImages}>
                                        Remove Images
                                    </button>
                                </div>
                                <div className='d-flex flex-column'>
                                    {
                                        errorImage?.invalidImageNames ? 
                                        <p className='mb-0 text-center px-2 pb-1 mt-2' style={{textDecoration:'underline', backgroundColor:'#d95757', color:'white', borderRadius:'5px'}}>Invalid Image:</p> : null
                                    }
                                    {   errorImage?.invalidImageNames ? errorImage?.invalidImageNames?.map((item, index) => (
                                        <span key={index}>{item}</span>
                                    )) : <span>Please upload less than 4 images</span>}
                                </div>
                                {/* <button>asd</button> */}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default MuiltiplesImages;
