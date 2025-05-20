import React from 'react'

// scss
import './review.scss'
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const Review = ({ items }) => {
    const { pic, name, review, date, rating, comment, user, updated_at} = items
    return (
        <div className="col-md-6  col-12 px-2 mt-lg-5 pt-lg-3 mt-3">
            <div className="doc-card pb-1 d-flex flex-column  align-items-center">
                <div className='d-flex justify-content-between align-items-center w-100 px-3 pt-2 mt-1'>
                    <div className='d-flex align-items-center reviewer'>
                        <div className='reviewer-pic'>
                            <img className='w-100 h-100' src={user?.profile_pic ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${user.profile_pic}` : ''} alt="" />
                        </div>
                        <div>
                        <p className='reviewer-name doc-review-name pl-2 mb-0'>{name}</p>
                        <p className='reviewer-date doc-review-date pl-2 mb-0'>{comment}</p>
                        </div>
                    </div>
                    Rating{rating}
                    <span>
                        <Stack spacing={1}>
                            <Rating name="half-rating" defaultValue={rating} precision={0.5} readOnly />
                        </Stack>
                    </span>
                   
                </div>
                <p className='doc-review-detail text-left w-100 px-3 pt-1'>{review}</p>
                data - time: {updated_at?.slice(0, 10)}/{updated_at?.slice(14, 19)}
            </div>
            
        </div>
    )
}

export default Review