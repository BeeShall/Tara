var allFriends = [];
var selectedItem;
$(document).ready(function() {
    initializeDisplays();

    $('#myModal').on('shown.bs.modal', function () {
        $('#myModal').focus()
        })

    $('#nextID').on('click', function () {
        FB.api('/me', function(response) {
            console.log(response);
            var userID = response.id;

            getAllFriends('me');
            $('.started').hide();
            $('#profile').fadeIn();
        });

        
    });

    $('#searchID').autocomplete({
        source: allFriends,
        select:function (event, ui) {
                for (var i in allFriends) {
                    if (allFriends[i].label == ui.item.label){
                        selectedItem = allFriends[i];

                        // Call it!
                        //alert(selectedItem.label + selectedItem.id);
                        
                    }
                }
            }
    })

    //  Handles on click if friend is clicked.
    $('#friendList').on('click', 'li', function () {
        var id = $(this).data("id");
        /* make the API call */
        FB.api("/"+id+"/feed",
            function (response) {
            if (response && !response.error) {
                /* handle the result */
                console.log("Result:")
                console.log(response);

                var allPosts = response.data;
                var toSend = [];
                for (var i in allPosts) {
                    toSend.push(allPosts[i].message);
                }
                
                $.post('/analyze', {
                    data: toSend.join(" ")
                },
                function (data, success) {
                    if (success) {
                        console.log(data);
                    }
                });
            }
            }
        );
    });

    $('#goButton').on('click', function () {
        if (selectedItem) {
            values = findValues(selectedItem.id);

            $.get('/analyze', {
                    data: values
                },
                function (data, success) {
                    if (success) {
                        // start the modal here.
                        $('#answer').append("<p>" + data +"</p>")
                        //return data;
                    }
                });
        }
    })


});

function findValues(id) {
    /* make the API call */
        FB.api("/"+id+"/feed",
            function (response) {
            if (response && !response.error) {
                /* handle the result */
                console.log("Result:")
                console.log(response);

                var allPosts = response.data;
                var toSend = [];
                for (var i in allPosts) {
                    toSend.push(allPosts[i].message);
                }

                return toSend;

                
            }
            }
        );
}

function getAllFriends(id) {
    // Returns all the friends.
    FB.api('/'+id+'/friends' , function (response) {
        var friends = response.data;

        for (var i = 0; i < friends.length; i++){
            console.log(friends[i])
            var fri = {
                label: friends[i].name,
                id: friends[i].id
            }
            //$('#friendList').append("<li>"+friends[i].name+"</li>");
            allFriends.push(fri);
            //$('#friendList').children().last().data("id", friends[i].id);
        }
    });
};


function initializeDisplays() {
    $('#facebookLogin').show();
    $('.started').hide();
    $('#profile').hide();
}