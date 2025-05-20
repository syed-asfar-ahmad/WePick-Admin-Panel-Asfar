import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ListSkeleton = ({ totalRow, totalCol, image }) => {
    return Array(totalRow).fill(0)?.map((_, index) => (<div className='pb-2 d-flex align-items-center w-100 h-100'>
        {!image ?
            Array(totalCol).fill(0)?.map((item, index) => (
                <div className='w-100 pr-3' >
                    <Skeleton height={20} style={{ flex: '1' }} />
                </div>
            )) : <>
                <Skeleton height={20} width={25} className='mr-2' />
                <Skeleton circle height={55} width={55} className='mr-2' />
                {Array(totalCol - 2).fill(0)?.map((item, index) => (
                    <div className='w-100 pr-3' >
                        <Skeleton height={20} style={{ flex: '1' }} />
                    </div>
                ))}
            </>
        }
    </div>))
}

export default ListSkeleton