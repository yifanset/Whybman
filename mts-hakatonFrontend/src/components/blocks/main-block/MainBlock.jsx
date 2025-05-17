import './main-block.css';
import img from './img.svg';

const MainBlock = () => {
    return (
        <div className='main-block__container'>
            <div className='main-block__block'>
                <p className='main-block__text'>КОНТРОЛЬ КАЧЕСТВА <br></br>ЭТИКЕТОК</p>
                
                <div className='main-block__text2'>
                    <p className='main-block__btn'>Больше никаких дефектов</p>
                    <p className='main-block__btn2'>Высокий уровень проверки ИИ</p>
                </div>            
            </div> 

            <img className='main-block__img' src={img} alt="img" />
        </div>
    )
}

export default MainBlock;