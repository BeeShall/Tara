$(document).ready(function() {
    $('#nextID').on('click', function () {
        FB.api('/me', function(response) {
            console.log(response);
            var userID = response.id;

            getAllFriends('me');

        });
    });

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
});

function getAllFriends(id) {
    // Returns all the friends.
    FB.api('/'+id+'/friends' , function (response) {
        var friends = response.data;

        for (var i = 0; i < friends.length; i++){
            console.log(friends[i])
            $('#friendList').append("<li>"+friends[i].name+"</li>");

            $('#friendList').children().last().data("id", friends[i].id);
        }
    });
};

