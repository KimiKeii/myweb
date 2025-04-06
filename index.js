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

    document.addEventListener("DOMContentLoaded", function () {
        const floatingHead = document.querySelector(".floating-head");
        const floatingBoard = document.querySelector(".floating-board");
    
        floatingHead.addEventListener("click", function (event) {
            // Toggle visibility
            if (floatingBoard.style.display === "none" || floatingBoard.style.display === "") {
                floatingBoard.style.display = "block";
            } else {
                floatingBoard.style.display = "none";
            }
            event.stopPropagation(); // Prevent closing on click
        });
    
        floatingBoard.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent closing when clicking inside the chatbox
        });
    
        // Close the floating board when clicking outside
        document.addEventListener("click", function (event) {
            if (!floatingHead.contains(event.target) && !floatingBoard.contains(event.target)) {
                floatingBoard.style.display = "none";
            }
        });
    });
    