import Header from '../components/Header';

export default function About() {
    return (
        <div style={styles.container}>
            <Header />
            <div style={styles.content}>
                <h2 style={styles.title}>About Water Tracker</h2>
                <div style={styles.card}>
                    <p style={styles.text}>
                        Welcome to the Water Tracker! You have just made one of the most important decisions 
                        of your entire life! This invention will change the way you live your life forever.
                    </p>
                    
                    <p style={styles.text}>
                        You may be wondering, how is that possible? With our technology, we are able to keep 
                        you accountable for getting your healthy daily water intake which in return will keep 
                        you as healthy as you can be.
                    </p>
                    
                    <p style={styles.text}>
                        With that being said, you will now be able to accomplish tasks at a rate you never 
                        thought you could! This is all thanks to Water Tracker!
                    </p>
                    
                    <p style={styles.callToAction}>
                        So what are you waiting for? Join Water Tracker today and start hydrating!
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f8ff', // Light blue background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        color: '#1e90ff', // Dodger blue
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        fontWeight: '600',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(30, 144, 255, 0.1)',
        lineHeight: '1.6',
    },
    text: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '1.5rem',
    },
    callToAction: {
        fontSize: '1.2rem',
        color: '#1e90ff',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: '2rem',
        fontStyle: 'italic',
    },
};