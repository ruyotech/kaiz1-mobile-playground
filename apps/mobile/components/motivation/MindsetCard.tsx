import { View, Text, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MindsetContent, MindsetTheme } from '../../types/models';

interface MindsetCardProps {
    content: MindsetContent;
    theme: MindsetTheme;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function MindsetCard({ content, theme }: MindsetCardProps) {
    // Calculate dynamic font size based on text length
    const getFontSize = (text: string) => {
        const length = text.length;
        if (length < 80) return 32;
        if (length < 120) return 28;
        if (length < 160) return 24;
        if (length < 200) return 22;
        return 20;
    };

    const fontSize = getFontSize(content.body);

    // Determine background type
    const hasImage = content.assetUrl || theme.defaultAsset;
    const hasGradient = theme.gradientColors && theme.gradientColors.length >= 2;

    return (
        <View style={styles.container}>
            {/* Background */}
            {hasImage ? (
                <ImageBackground
                    source={{ uri: content.assetUrl || theme.defaultAsset }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
                </ImageBackground>
            ) : hasGradient ? (
                <LinearGradient
                    colors={theme.gradientColors as any}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            ) : (
                <View 
                    style={[
                        StyleSheet.absoluteFill, 
                        { backgroundColor: theme.backgroundColor }
                    ]} 
                />
            )}

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Quote Body */}
                <Text
                    style={[
                        styles.body,
                        { 
                            color: theme.textColor,
                            fontSize,
                            lineHeight: fontSize * 1.4,
                        }
                    ]}
                >
                    {content.body}
                </Text>

                {/* Author Attribution */}
                {content.author && (
                    <Text
                        style={[
                            styles.author,
                            { color: theme.textColor }
                        ]}
                    >
                        — {content.author}
                    </Text>
                )}

                {/* Dimension Tag Indicator */}
                {content.dimensionTag !== 'generic' && (
                    <View style={[styles.tagBadge, { backgroundColor: theme.accentColor + '30' }]}>
                        <Text style={[styles.tagText, { color: theme.accentColor }]}>
                            {getDimensionLabel(content.dimensionTag)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Subtle Swipe Indicator */}
            <View style={styles.swipeIndicator}>
                <Text style={[styles.swipeText, { color: theme.textColor + '60' }]}>
                    ↓ Swipe for more
                </Text>
            </View>
        </View>
    );
}

function getDimensionLabel(tag: string): string {
    const labels: Record<string, string> = {
        'lw-1': '💪 Health & Fitness',
        'lw-2': '💼 Career & Work',
        'lw-3': '💰 Finance & Money',
        'lw-4': '📚 Personal Growth',
        'lw-5': '❤️ Relationships & Family',
        'lw-6': '👥 Social Life',
        'lw-7': '🎮 Fun & Recreation',
        'lw-8': '🏡 Environment & Home',
        'q2_growth': '📈 Q2 Growth',
    };
    return labels[tag] || '';
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: 32,
        maxWidth: SCREEN_WIDTH - 64,
        alignItems: 'center',
    },
    body: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    author: {
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.8,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tagBadge: {
        marginTop: 32,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 13,
        fontWeight: '600',
    },
    swipeIndicator: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
    },
    swipeText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
