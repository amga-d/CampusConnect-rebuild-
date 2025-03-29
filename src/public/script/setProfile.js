// Image preview functionality
const profileInput = document.getElementById("profileImage");
const previewImage = document.getElementById("previewImage");
const profilePreview = document.getElementById("profilePreview");
const previewIcon = profilePreview.querySelector(".default-profile");
const deleteImage = document.querySelector(".delete-image");
const profileForm = document.getElementById("profileForm");

profileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      previewIcon.style.display = "none";
      deleteImage.style.display = "flex";
    };

    reader.readAsDataURL(file);
  }
});

// Add delete functionality
deleteImage.addEventListener("click", function () {
  // Reset the file input
  profileInput.value = "";

  // Hide the preview image and show the default icon
  previewImage.style.display = "none";
  previewIcon.style.display = "block";
  deleteImage.style.display = "none";
});

// Form submission
profileForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const image = profileInput.files[0];
  const birthdate = profileForm.birthdate.value;
  const gender = profileForm.gender.value;
  const bio = profileForm.bio.value;

  const formData = new FormData();
  formData.append("profile", image);
  formData.append("birthdate", birthdate);
  formData.append("gender", gender);
  formData.append("bio", bio);

  try {
    const res = await fetch("/setProfile", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      alert(data.error);
    } else {
      window.location.href = res.url;
    }
  } catch (err) {
    console.log(err);
  }
});
