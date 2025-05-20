import tickVector from '../../assets/images/common/tick.svg'
import '../../assets/css/common/common.scss'

const Tick = ({onTick}) => {
  return (
    <div className='tick-icon' onClick={onTick}  >
    <img src={tickVector} width='10px' />
    </div>
  )
}

export default Tick;
