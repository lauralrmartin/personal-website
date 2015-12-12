
// ----------------------------------------------------------------------
// - Function for the form validation and where we submit the form data
// - to the PHP endpoint
// ---------------------------------------------------------------------

function validateandSendForm() {
    var name = $("input#name").val(),
        email = $("input#email").val(),
        subject = $("input#subject").val(),
        message = $("textarea#message").val();


    // - Regular expression for the form validation

    if(name == null || name.length == 0 || /^\s+$/.test(name) ) {
        $("#nameError").text("Please enter a valid name").show().fadeOut(3000);
        return false;
    } else if(!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
        $("#emailError").text("Please enter a valid email").show().fadeOut(3000);
        return false;
    } else if(subject == null || /^\s+$/.test(subject)) {
        $("#subjectError").text("ERROR").show().fadeOut(3000);
        return false;
    } else if(message == null || message.length == 0 || /^\s+$/.test(message)){
        $("#messageError").text("Please enter a message").show().fadeOut(3000);
        return false;
    }

    // - Submit the form to the PHP endpoint

    var request = $.ajax({
        url: "././php/mail.php",
        type: "POST",
        data: {
            name: name,
            subject: subject,
            email: email,
            message: message
        },
        cache: false
    });

    request.done(function() {
        // Success message
        $('#timelineForm').html("<p>Thank you! Your message has been sent</p>");
    })
    .error(function() {
        // Failure message
        $('#timelineForm').html("<p>Something was wrong</p>");
    });
}


(function($, w) {

    // - Check if the libraries are included to our project
    if ($ === undefined) {
        throw new Error('You have to include JQuery!')
    }

    if (w === undefined) {
        throw new Error('You have to include Waypoints!')
    }

    // - Function for when the page is ready
    $(function() {

        // -------------------------------------------------------------------------
        // - Adding style and behavior to the menu:
        // - scroll class: Change the menu and fonts colors.
        // - active: Will change depends of the position an section of your page
        // -------------------------------------------------------------------------

        var nav = $('#nav'),
            links = nav.find('a'),
            menuSize = 54;

        // - Initialize the menu if we reload the page and we aren't on the top

        if ($(document).scrollTop() > 0){
            nav.addClass('scroll');
        }

        // - Check when we do scroll on the page

        $(document).scroll(function(){
            if ($(document).scrollTop() > 0){
                nav.addClass('scroll');
            }
            else {
                nav.removeClass('scroll');
            }
        });

        // - Highlights current section link

        $('section, header').waypoint(function(d) {
            links.removeClass('active');
            nav.find('[href*='+this.element.id+']').addClass('active');
        }, {
            offset: menuSize + 5
        });


        // ---------------------------------------------------------------------
        // - This function have two behavior:
        // - 1. If the form fields are hidden when you click on submit you will
        // - see the fields and be able to send a message.
        // - 2. If you can see the fields when you click on submit your form
        // - will be validate
        // ---------------------------------------------------------------------

        $('#formSubmit').on('click', function(e) {
            e.preventDefault();
            var fields = $('#formFields'),
                form = $('form');

            if (fields.is( ":hidden" )) {
                fields.slideDown("slow");
                $(this).text('Send');
            } else {
                validateandSendForm();
            }

        });


        // ---------------------------------------------------------------------------
        // - Function to show and hide (with a css animation) the different sections
        // - to the timeline depends of the position of the screen
        // ---------------------------------------------------------------------------

        $('.timeline__moment').each(function(i) {
            var _this = $(this);

            _this.waypoint(function(d) {

                _this.removeClass("timeline__hidden");
                _this.addClass("animated");

                if (i % 2 == 0) {
                    if (d === "down") {
                        _this.removeClass('left-up');
                        _this.addClass('left-down');
                    } else {
                        _this.removeClass('left-down');
                        _this.addClass('left-up');
                    }
                } else {
                    if (d === "down") {
                        _this.removeClass('right-up');
                        _this.addClass('right-down');
                    } else {
                        _this.removeClass('right-down');
                        _this.addClass('right-up');
                    }
                }

            }, {
                offset: '80%'
            })
        });


        // ---------------------------------------------------------------------
        // - Easy Pie Chart lets us create a beautiful canvas with a really
        // - cool animation to show a pie with the skills
        // ---------------------------------------------------------------------

        $('#skills').waypoint(function(){
            $('.chart').each(function(){
                $(this).easyPieChart({
                    barColor: '#F0F0F0',
                    trackColor: '#BA68C8',
                    scaleColor: false,
                    size:150,
                    animate: 3000,
                    lineCap: 'butt',
                    lineWidth: 15
                });
            });
        },{offset:'80%'});


        // ---------------------------------------------------------------------
        // - Function to remove the id in the paths when we click in an id and
        // - to have a smooth scrolling animation
        // ---------------------------------------------------------------------

        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);

                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').stop().animate({
                        scrollTop: target.offset().top - menuSize
                    }, 1000);
                    return false;
                }
            }
        });

    });

})(jQuery, Waypoint);