import { FaLinkedin,FaXTwitter,FaGithub } from "react-icons/fa6";

export default function Footer(){
    return (
        <footer className=" py-12 max-w-6xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025. All Rights Reserved.
                </span>
                <div className="flex mt-4 sm:justify-center sm:mt-0">
                    <a href="https://www.linkedin.com/in/trilochan-sahoo-6365871b6/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <FaLinkedin/>
                    </a>
                    <a href="https://x.com/Trilochan026" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <FaXTwitter/>
                    </a>
                    <a href="https://github.com/TrilochanSahoo" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <FaGithub/>
                    </a>
                </div>
            </div>
        </footer>
    )
}