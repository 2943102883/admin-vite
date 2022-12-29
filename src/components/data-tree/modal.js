import {ref} from 'vue'
export  const modal = ({ props, context })=>{
	const modalText = ref('Content of the modal');
	const visible = ref(false);
	const confirmLoading = ref(false);


	return {
		modalText,
		visible,
		confirmLoading,
		showModal,
		handleOk,
	};
}