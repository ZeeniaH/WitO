function useNumberOnly(setFieldValue, field, e) {
	return setFieldValue(field, e.target.value.replace(/\D/g, ""));
}

export default useNumberOnly;
