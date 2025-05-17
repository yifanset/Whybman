import './team-page.css';
import teamList from './teamphoto.jpg';
import teamList1 from './teamphoto768.jpg';
import { useEffect } from 'react';

const TeamPage = () => {
  useEffect(() => {
    let scrollDirection = 'down'; // Направление скролла: 'down' или 'up'

    const scrollInterval = setInterval(() => {
      const currentScrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollDirection === 'down') {
        // Прокрутка вниз
        if (currentScrollPosition + windowHeight < scrollHeight) {
          window.scrollBy(0, 3); // Прокручиваем на 10 пикселей вниз
        } else {
          // Когда достигнут низ, сразу прокручиваем в начало
          window.scrollTo(0, 0); // Моментально возвращаемся в начало страницы
        }
      }
    }, 30); // Каждые 50 мс

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div>
        <img 
          src={teamList} 
          alt="team" 
          className="team-page__photo"
       />

        <img 
          src={teamList1}  
          alt="team" 
          className="team-page__photo1"
       />
      </div>
  );
};

export default TeamPage;
