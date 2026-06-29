// 1. COURSES TRANSACTION CONTROLLER
  const saveCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCourse(true);
    try {
      // Stripped out 'description' entirely to match your exact DB schema columns
      const dbPayload = {
        title: courseForm.title,
        tagline: courseForm.tagline,
        overview: courseForm.overview || courseForm.description, // Maps safely to your 'overview' column
        instructor_name: courseForm.instructor_name,
        instructor_bio: courseForm.instructor_bio,
        price_naira: Number(courseForm.price_naira),
        price: String(courseForm.price_naira),
        thumbnail_url: courseForm.cover_url || courseForm.thumbnail_url,
        video_url: courseForm.video_url,
        duration_text: courseForm.duration_text,
        duration: courseForm.duration_text
      };

      if (editingCourse) {
        const { error } = await supabase.from("courses").update(dbPayload).eq("id", editingCourse.id);
        if (error) throw error;
        triggerToast("Course details updated successfully inside cloud matrix.");
      } else {
        const { error } = await supabase.from("courses").insert([dbPayload]);
        if (error) throw error;
        triggerToast("New course track committed to the cloud layout engine.");
      }
      setIsCourseModalOpen(false);
      await fetchCoreLmsMatrix();
    } catch (err: any) {
      console.error(err);
      alert(`Course operational failure: ${err.message}`);
    } finally {
      setIsSavingCourse(false);
    }
  };