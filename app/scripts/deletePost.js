$('.deleteBtn').click(function(){
			let id = $(this).attr('id');
			$.ajax({
				method: "DELETE",
				url: "/post/" + id,
			}).done(function(){
				alert('The post has been deleted');
				window.location.reload(true);
			}).fail(function(){
				alert('Sorry, an error occured. Try again later.');
			});
		});