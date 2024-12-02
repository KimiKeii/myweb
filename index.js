const section = document.querySelector('.section-choice'),
    sectionContainer = section.querySelector('.section_container'),
    sectionCol = section.querySelectorAll('.section_col'),
    sectionCaptions = section.querySelectorAll('.section_col_caption');

    const isDesktop = window.matchMedia('(min-width: 768px)');

    const init = () => {
        if(isDesktop.matches) addEventListeners();
    }

    const addEventListeners = () => {
        //? set the classs active to the first element
        sectionCol[1].classList.add('active');

        sectionCol.forEach((col, index)=>{
            col.addEventListener('mouseenter', ()=>{
                sectionCol.forEach((el)=>el.classList.remove('active'));

                col.classList.add('active');

                //?add the class active again to the last column element if the current col sectionCol array
                if(index === col.length - 1 ) col.classList.add('active');
            })
        })
    }
    
    init()